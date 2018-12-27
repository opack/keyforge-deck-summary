import { TypesEnum } from 'enums/types-enum';
import { HousesEnum } from 'enums/houses-enum';

export class CardModel {
  title: string;
  type: TypesEnum;
  house: HousesEnum;
  aember: number;
  power: number;
  armor: number;
}

