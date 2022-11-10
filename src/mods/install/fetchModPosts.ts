import { ApolloClient, ApolloLink, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { appVersion } from "@common/constants";
import { fetch } from "cross-fetch";
import electronLog from "electron-log";
import type { GraphQLError } from "graphql";
import type { Game } from "mods/types";

type ModPostResponse = {
  id: number;
  title: string;
  thumbnail_url: string;
  category: string;
};

type ModPostDetailsResponse = {
  id: number;
  description: string;
  author: string;
  filename: string;
  download_url: string;
  alternate_url: string;
  image_urls: string[];
  upload_date: string;
  update_date: string;
  downloads: number;
  likes: number;
};

const log = electronLog.scope("mods/fetchModPosts");
const isDevelopment = process.env.NODE_ENV !== "production";

const httpLink = new HttpLink({ uri: process.env.LYLAT_GRAPHQL_ENDPOINT, fetch });
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => Boolean(error),
  },
});
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      log.error(`Apollo GQL Error: Message: ${message}, Location: ${locations}, Path: ${path}`),
    );
  }
  if (networkError) {
    log.error(`Apollo Network Error: ${networkError}`);
  }
});

const apolloLink = ApolloLink.from([errorLink, retryLink, httpLink]);

const client = new ApolloClient({
  link: apolloLink,
  cache: new InMemoryCache(),
  name: "lylat-launcher",
  version: `${appVersion}${isDevelopment ? "-dev" : ""}`,
});

const getFeaturedModsQuery = gql`
  query GetFeaturedMods($game: Game) {
    getFeaturedMods(game: $game) {
      id
      title
      thumbnail_url
      category
    }
  }
`;

const getModPostDetailsQuery = gql`
  query GetModPost($id: Int) {
    getModPost(id: $id) {
      id
      description
      author
      filename
      download_url
      alternate_url
      image_urls
      upload_date
      update_date
      downloads
      likes
    }
  }
`;

const handleErrors = (errors: readonly GraphQLError[] | undefined) => {
  if (errors) {
    let errMsgs = "";
    errors.forEach((err) => {
      errMsgs += `${err.message}\n`;
    });
    throw new Error(errMsgs);
  }
};

export async function fetchFeaturedModPosts(game: Game): Promise<ModPostResponse[]> {
  const res = await client.query({
    query: getFeaturedModsQuery,
    fetchPolicy: "network-only",
    variables: {
      game: game.toUpperCase(),
    },
  });

  handleErrors(res.errors);
  return res.data.getFeaturedMods;
}

export async function fetchModPostDetails(id: number): Promise<ModPostDetailsResponse> {
  const res = await client.query({
    query: getModPostDetailsQuery,
    fetchPolicy: "network-only",
    variables: {
      id: id,
    },
  });

  handleErrors(res.errors);
  return res.data.getModPost;
}
