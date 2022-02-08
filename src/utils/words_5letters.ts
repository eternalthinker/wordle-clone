import { _guessList5Letters } from "./guess_list_5letters";
import { _solutionList5Letters } from "./solution_list_5letters";

const _guessSet5Letters = new Set(_guessList5Letters);
_solutionList5Letters.forEach((word) => _guessSet5Letters.add(word));

export const guessSet5Letters = _guessSet5Letters;
export const solutionList5Letters = _solutionList5Letters;
