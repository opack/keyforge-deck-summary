import { TypesEnum } from './TypesEnum';
import { HousesEnum } from './HousesEnum';

export class CardModel {
  title: string;
  type: TypesEnum;
  house: HousesEnum;
  aember: number;
  power: number;
  armor: number;
}
