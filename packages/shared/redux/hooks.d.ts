import type { TypedUseSelectorHook } from "react-redux";
import type { AppStore, RootState } from "./index";

export declare const useAppDispatch: () => AppStore["dispatch"];
export declare const useAppSelector: TypedUseSelectorHook<RootState>;