export interface IPositions {
  [key: string]: string | undefined;
}

export interface IFigure {
  x: number;
  y: number;
  xy: string;
  name: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  color: "black" | "white";
  piece: string;
}

export interface IDestination {
  x: number;
  y: number;
  xy: string;
}

export interface IEnPassantMoves {
  white: [string[], string] | [];
  black: [string[], string] | [];
}

export interface ICastling {
  white: {
    short: boolean;
    long: boolean;
  };
  black: {
    short: boolean;
    long: boolean;
  };
}

export type ChessState = {
  activePlayer: "white" | "black";
  positions: {
    [key: string]: string | undefined;
  };
  selectedFigure: IFigure | undefined;
  validMoves: string[];
  enPassantMoves: IEnPassantMoves;
  castling: {
    white: { short: boolean; long: boolean };
    black: { short: boolean; long: boolean };
  };
  pawnPromotion: string;
  check: { white: boolean; black: boolean };
  mate: boolean;
  rotateBoard: boolean;
};

type TurnSwitchAction = { type: "CHANGE_PLAYER"; payload: "white" | "black" };
type PositionsAction = {
  type: "UPDATE_POSITIONS";
  payload: { moveInfo: [IFigure, IDestination] };
};
type UpgradePawnAction = { type: "UPGRADE_PAWN"; payload: { figure: string } };
type SelectFigureAction = {
  type: "SELECT_FIGURE";
  payload: { figure: IFigure; promotion?: boolean };
};
type DeselectFigureAction = { type: "DESELECT_FIGURE" };
type CheckForEnPassantAction = { type: "CHECK_FOR_EN_PASSANT"; payload: string[] };
type PreventEnPassantAction = { type: "PREVENT_EN_PASSANT" };
type UpdateCastlingStatusAction = {
  type: "UPDATE_CASTLING_STATUS";
  payload: { moveInfo: [IFigure, IDestination] };
};
type PromotePawnAction = { type: "PROMOTE_PAWN"; payload: string };
type EndPawnPromotionAction = { type: "END_PAWN_PROMOTION" };
type UpdateCheckStatusAction = { type: "UPDATE_CHECK_STATUS" };
type CheckForMateAction = { type: "CHECK_FOR_MATE" };
type RotateBoardAction = { type: "ROTATE_BOARD" };
type ResetAction = { type: "RESET" };

export type ChessAction =
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
