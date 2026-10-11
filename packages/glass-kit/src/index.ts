// Material
export { Glass, type GlassProps, type GlassVariant, type GlassSize } from "./components/Glass";

// Presets
export {
  GLASS_PRESETS,
  TINT_STYLES,
  type GlassPreset,
  type GlassPresetName,
  type TintStyle,
  type TintStylePreset,
} from "./presets";

// Controls
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize, type ButtonShape } from "./components/Button";
export { Toggle, type ToggleProps } from "./components/Toggle";
export { Slider, type SliderProps } from "./components/Slider";
export { SegmentedControl, type SegmentedControlProps, type SegmentOption } from "./components/SegmentedControl";
export { Stepper, type StepperProps } from "./components/Stepper";
export { SearchField, type SearchFieldProps } from "./components/SearchField";
export { Menu, type MenuProps, type MenuAction, type MenuEntry } from "./components/Menu";

// Navigation
export { TabBar, type TabBarProps, type TabItem } from "./components/TabBar";
export { NavigationBar, ScrollEdge, type NavigationBarProps, type ScrollEdgeProps } from "./components/NavigationBar";
export { Carousel, type CarouselProps } from "./components/Carousel";
export { PageControl, type PageControlProps } from "./components/PageControl";

// Presentation + feedback
export { Sheet, type SheetProps, type SheetDetent } from "./components/Sheet";
export { Alert, type AlertProps, type AlertAction } from "./components/Alert";
export { Toaster, toast, dismissToast, type ToastOptions } from "./components/Toast";
export { Progress, Spinner, type ProgressProps, type SpinnerProps } from "./components/Progress";
export { Reveal, type RevealProps } from "./components/Reveal";

// Appearance (iOS 27 transparency slider)
export { TransparencySlider, GlassAppearancePanel } from "./components/GlassAppearance";
export {
  useGlassSettings,
  getGlassSettings,
  setGlassSettings,
  resetGlassSettings,
  DEFAULT_SETTINGS,
  TRANSPARENCY_PRESETS,
  type GlassSettings,
  type GlassTheme,
} from "./settings/store";

// Engine
export { useLens, type LensConfig, type LensResult } from "./engine/useLens";
export { createLensMap, type LensOptions, type LensMap, type BezelProfile } from "./engine/lens-map";
export { supportsRefraction, prefersReducedMotion } from "./engine/capabilities";

// Motion + utilities
export { springs, springValue, springDuration, springEasing, type SpringConfig } from "./motion/spring";
export { useSlidingIndicator } from "./lib/useSlidingIndicator";
export { cn } from "./lib/cn";
