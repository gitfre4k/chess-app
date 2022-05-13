import { startingPositions } from "../constants/positions";

import {
  getNewPositions,
  upgradePawn,
  updateCastlingStatus,
  getValidMoves,
  preventEnPassant,
  checkForEnPassant,
  updateCheckStatus,
  checkForMate,
} from "./actions";

import { ChessState, ChessAction } from "../interfaces";

const initialState: ChessState = {
  activePlayer: "white",
  positions: startingPositions,
  selectedFigure: undefined,
  validMoves: [],
  enPassantMoves: { white: [], black: [] },
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
