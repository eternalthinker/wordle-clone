import { _guessList6Letters } from "./guess_list_6letters";
import { _solutionList6Letters } from "./solution_list_6letters";

const _guessSet6Letters = new Set(_guessList6Letters);
_solutionList6Letters.forEach((word) => _guessSet6Letters.add(word));

export const guessSet6Letters = _guessSet6Letters;
export const solutionList6Letters = _solutionList6Letters;
