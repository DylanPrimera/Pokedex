import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PokeApiResponse } from './interfaces/poke-response.interface';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class SeedService {
  constructor(private readonly axiosService: HttpService) {}
  async excecuteSeed() {
    const { data } = await firstValueFrom(
      this.axiosService
        .get<PokeApiResponse>('https://pokeapi.co/api/v2/pokemon?limit=2')
        .pipe(
          catchError(() => {
            throw new InternalServerErrorException(
              `Can't excecute the action, check server logs`,
            );
          }),
        ),
    );
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const pokemonNumber = +segments[segments.length - 2];
      console.log({ name, pokemonNumber });
    });
  }
}
