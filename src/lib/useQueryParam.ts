import React, { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { Action } from "history";

export type QueryParams<K extends string> = {
  [key in K]?: string;
};

export function parseQueryParamsFromSearch(
  search: string
): { [key: string]: string } {
  const params = new URLSearchParams(search);
  const object: { [key: string]: string } = {};
  params.forEach((value, key) => (object[key] = value));
  return object;
}

export function queryParamsToSearch<T extends QueryParams<K>, K extends string>(
  query: T
) {
  const searchParams = new URLSearchParams();
  for (const key in query) {
    const value = query[key];
    if (value && typeof value === "string") {
      searchParams.set(key, value);
    }
  }
  return `?${searchParams.toString()}`;
}

export default function useQueryParams<K extends string>(
  [defaultQueryParams, setQueryParams]: [
    QueryParams<K>,
    React.Dispatch<React.SetStateAction<QueryParams<K>>>
  ],
  method = "REPLACE" as Exclude<Action, "POP">
): [QueryParams<K>, (newQueryParams: QueryParams<K>) => void] {
  const history = useHistory();
  const location = useLocation();

  const setValueWithQuery = useCallback(
    (newQueryParams: QueryParams<K>) => {
      const search = queryParamsToSearch(newQueryParams);
      setQueryParams(newQueryParams);
      switch (method) {
        case "REPLACE":
          history.replace({
            ...location,
            search
          });
          break;
        case "PUSH":
          history.push({
            ...location,
            search
          });
          break;
        default:
          console.error(new Error(`unexpected case: ${method}`));
      }
    },
    [history, location, method, setQueryParams]
  );

  const params = useMemo(() => {
    return location.search.indexOf("=") > -1
      ? {
          ...defaultQueryParams,
          ...parseQueryParamsFromSearch(location.search)
        }
      : defaultQueryParams;
  }, [defaultQueryParams, location.search]);

  return [params, setValueWithQuery];
}
