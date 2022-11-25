import { useState } from "react";
import { SettingsAnimationState } from "../types";

export const useSettingsAnimation = (): SettingsAnimationState => {
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleOpenSettings = () => {
    setSettingsCollapsed(false);
    setIsOpening(true);
    setTimeout(() => {
      setIsOpening(false);
    }, 50);
  };

  const handleCloseSettings = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSettingsCollapsed(true);
      setIsClosing(false);
    }, 250);
  };

  return {
    settingsCollapsed,
    isOpening,
    isClosing,
    handleOpenSettings,
    handleCloseSettings,
  };
};
