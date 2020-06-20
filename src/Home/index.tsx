import React, { useCallback } from "react";

import Tutorial from "./Tutorial";
import YourMailMasks from "./YourMailMasks";
import { message } from "antd";
import useLocalStorage from "../lib/useLocalStorage";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [hideTutorial, setHideTutorial] = useLocalStorage(
    "hideTutorial",
    false
  );

  const handleSkipTutorial = useCallback(() => {
    message.info("Tutorial skipped!");
    setHideTutorial(true);
  }, [setHideTutorial]);

  return hideTutorial ? (
    <YourMailMasks />
  ) : (
    <Tutorial onSkipTutorial={handleSkipTutorial} />
  );
};

export default Home;
