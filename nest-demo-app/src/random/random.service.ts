import { Injectable } from '@nestjs/common';

type CharacterType =
  | 'lowerCaseLetter'
  | 'upperCaseLetter'
  | 'number'
  | 'symbol';

@Injectable()
export class RandomService {
  private characterDictionaries: {
    [key in Required<CharacterType>]: string;
  } = {
    lowerCaseLetter: 'abcdefghijklmnopqrstuvwxyz',
    upperCaseLetter: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '1234567890',
    symbol: '-=[]\\;,./!@#$%^&*()_+{}|:<>?',
  };

  createRandomString(length: number, characterTypes: CharacterType[]) {
    const charDicts = characterTypes.map(
      (type) => this.characterDictionaries[type],
    );
    const joinedCharDict = charDicts.join('');
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = this.getRandomInt(joinedCharDict.length);
      const randomWord = joinedCharDict[randomIndex];
      randomString += randomWord;
    }
    return randomString;
  }

  private getRandomInt(number: number) {
    return Math.floor(Math.random() * number);
  }
}
