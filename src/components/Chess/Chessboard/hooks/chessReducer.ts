import { startingPositions } from "../../../../constants/positions";
import { getNewPositions, upgradePawn } from "./positions";
import { getValidMoves } from "./figure";
import { preventEnPassant, checkForEnPassant } from "./enPassant";
import { updateCastlingStatus } from "./castling";
import { updateCheckStatus, checkForMate } from "./useCheckMate";

import { IFigure, IEnPassantMoves, IDestination } from "../interfaces";

type ChessState = {
  activePlayer: "white" | "black";
  positions: {
    [key: string]: string | undefined;
  };
  selectedFigure: IFigure | undefined;
  validMoves: string[];
  enPassantMoves: IEnPassantMoves;
  castling: {
    white: {
      short: boolean;
      long: boolean;
    };
    black: {
      short: boolean;
      long: boolean;
    };
  };
  pawnPromotion: string;
  check: {
    white: boolean;
    black: boolean;
  };
  mate: boolean;
  rotateBoard: boolean;
};

type TurnSwitchAction = { type: "CHANGE_PLAYER"; payload: "white" | "black" };
type PositionsAction = {
  type: "UPDATE_POSITIONS";
  payload: { moveInfo: [IFigure, IDestination] };
};
type UpgradePawnAction = {
  type: "UPGRADE_PAWN";
  payload: { figure: string };
};
type SelectFigureAction = {
  type: "SELECT_FIGURE";
  payload: {
    figure: IFigure;
    promotion?: boolean;
  };
};
type DeselectFigureAction = { type: "DESELECT_FIGURE" };
type CheckForEnPassantAction = { type: "CHECK_FOR_EN_PASSANT"; payload: string[] };
type PreventEnPassantAction = { type: "PREVENT_EN_PASSANT" };
type UpdateCastlingStatusAction = {
  type: "UPDATE_CASTLING_STATUS";
  payload: { moveInfo: [IFigure, IDestination] };
};
type PromotePawnAction = {
  type: "PROMOTE_PAWN";
  payload: string;
};
type EndPawnPromotionAction = { type: "END_PAWN_PROMOTION" };
type UpdateCheckStatusAction = { type: "UPDATE_CHECK_STATUS" };
type CheckForMateAction = { type: "CHECK_FOR_MATE" };
type RotateBoardAction = { type: "ROTATE_BOARD" };
type ResetAction = { type: "RESET" };

type ChessAction =
  | TurnSwitchAction
  | PositionsAction
  | UpgradePawnAction
  | SelectFigureAction
  | DeselectFigureAction
  | CheckForEnPassantAction
  | PreventEnPassantAction
  | UpdateCastlingStatusAction
  | PromotePawnAction
  | EndPawnPromotionAction
  | UpdateCheckStatusAction
  | CheckForMateAction
  | RotateBoardAction
  | ResetAction;

const initialState: ChessState = {
  activePlayer: "white",
  positions: startingPositions,
  selectedFigure: undefined,
  validMoves: [],
  enPassantMoves: {
    white: [],
    black: [],
  },
  castling: {
    white: { short: true, long: true },
    black: { short: true, long: true },
  },
  pawnPromotion: "",
  check: { white: false, black: false },
  mate: false,
  rotateBoard: false,
};

const reducer = (state: ChessState, action: ChessAction) => {
  switch (action.type) {
    case "CHANGE_PLAYER":
      return { ...state, activePlayer: action.payload };

    case "UPDATE_POSITIONS":
      return {
        ...state,
        positions: getNewPositions(
          action.payload.moveInfo,
          state.activePlayer,
          state.enPassantMoves,
          state.positions
        ),
      };

    case "UPGRADE_PAWN":
      return {
        ...state,
        positions: upgradePawn(state.pawnPromotion, action.payload.figure, state.positions),
      };

    case "SELECT_FIGURE":
      return {
        ...state,
        selectedFigure: action.payload.figure,
        validMoves: getValidMoves(
          action.payload.figure,
          state.positions,
          state.enPassantMoves,
          state.castling,
          action.payload.promotion
        ),
      };

    case "DESELECT_FIGURE":
      return { ...state, selectedFigure: undefined, validMoves: [] };

    case "CHECK_FOR_EN_PASSANT":
      return {
        ...state,
        enPassantMoves: checkForEnPassant(state.enPassantMoves, action.payload, state.positions),
      };

    case "PREVENT_EN_PASSANT":
      return {
        ...state,
        enPassantMoves: preventEnPassant(state.enPassantMoves, state.activePlayer),
      };

    case "UPDATE_CASTLING_STATUS":
      return { ...state, castling: updateCastlingStatus(action.payload.moveInfo, state.castling) };

    case "PROMOTE_PAWN":
      return { ...state, pawnPromotion: action.payload };

    case "END_PAWN_PROMOTION":
      return { ...state, pawnPromotion: "" };

    case "UPDATE_CHECK_STATUS":
      return {
        ...state,
        check: updateCheckStatus(state.activePlayer, state.positions, state.check),
      };

    case "CHECK_FOR_MATE":
      return { ...state, mate: checkForMate(state.activePlayer, state.positions) };

    case "ROTATE_BOARD":
      return { ...state, rotateBoard: !state.rotateBoard };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

export { initialState, reducer };
