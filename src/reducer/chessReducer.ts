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
  uploadToFirebase,
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
    case "CHANGE_PLAYER": {
      action.payload.roomID &&
        uploadToFirebase("activePlayer", action.payload.value, action.payload.roomID);
      return { ...state, activePlayer: action.payload.value };
    }

    case "UPDATE_POSITIONS": {
      const newPositions = getNewPositions(
        action.payload.moveInfo,
        state.activePlayer,
        state.enPassantMoves,
        state.positions
      );
      action.payload.roomID && uploadToFirebase("positions", newPositions, action.payload.roomID);
      return {
        ...state,
        positions: newPositions,
      };
    }

    case "UPGRADE_PAWN": {
      const newPositions = upgradePawn(state.pawnPromotion, action.payload.figure, state.positions);
      action.payload.roomID && uploadToFirebase("positions", newPositions, action.payload.roomID);
      return {
        ...state,
        positions: newPositions,
      };
    }

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

    case "CHECK_FOR_EN_PASSANT": {
      const newEnPassantMoves = checkForEnPassant(
        state.enPassantMoves,
        action.payload.value,
        state.positions
      );
      action.payload.roomID &&
        uploadToFirebase("enPassantMoves", newEnPassantMoves, action.payload.roomID);
      return {
        ...state,
        enPassantMoves: newEnPassantMoves,
      };
    }

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

    case "SYNC_POSITIONS":
      return {
        ...state,
        positions: action.payload.value,
      };

    case "SYNC_EN_PASSANT_MOVES":
      return {
        ...state,
        enPassantMoves: action.payload.value,
      };

    case "ROTATE_BOARD":
      return { ...state, rotateBoard: !state.rotateBoard };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

export { initialState, reducer };
