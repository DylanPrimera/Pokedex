import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PokeApiResponse } from './interfaces/poke-response.interface';
import { catchError, firstValueFrom } from 'rxjs';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SeedService {
  constructor(
    private readonly axiosService: HttpService,
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async excecuteSeed() {
    await this.pokemonModel.deleteMany();
    const { data } = await firstValueFrom(
      this.axiosService
        .get<PokeApiResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
        .pipe(
          catchError(() => {
            throw new InternalServerErrorException(
              `Can't excecute the action, check server logs`,
            );
          }),
        ),
    );
    const pokemons = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const pokemonNumber = +segments[segments.length - 2];
      return {
        name,
        no: pokemonNumber,
      };
    });
    await this.pokemonModel.insertMany(pokemons);
    return 'Seed excecuted';
  }
}
