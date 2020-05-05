import * as Types from "../../generated/types";

import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";

export type ExportDataQueryVariables = {};

export type ExportDataQuery = { readonly __typename?: "Query" } & Pick<
  Types.Query,
  "exportData"
>;

export const ExportDataDocument = gql`
  query ExportData {
    exportData
  }
`;

/**
 * __useExportDataQuery__
 *
 * To run a query within a React component, call `useExportDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useExportDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExportDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useExportDataQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ExportDataQuery,
    ExportDataQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<ExportDataQuery, ExportDataQueryVariables>(
    ExportDataDocument,
    baseOptions
  );
}
export function useExportDataLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ExportDataQuery,
    ExportDataQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ExportDataQuery,
    ExportDataQueryVariables
  >(ExportDataDocument, baseOptions);
}
export type ExportDataQueryHookResult = ReturnType<typeof useExportDataQuery>;
export type ExportDataLazyQueryHookResult = ReturnType<
  typeof useExportDataLazyQuery
>;
export type ExportDataQueryResult = ApolloReactCommon.QueryResult<
  ExportDataQuery,
  ExportDataQueryVariables
>;
