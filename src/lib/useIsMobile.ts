import useWindowSize from "./useWindowSize";

export default function useIsMobile() {
  const size = useWindowSize();

  if (size.width && size.width < 500) {
    return true;
  }
  return false;
}
