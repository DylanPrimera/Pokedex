/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v'); // asc
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    // search by pokemon number
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }

    // search by MongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // search by name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) throw new NotFoundException(`Pokemon not found`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }
    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(_id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id,
    });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon wit id '${_id}' not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon ${JSON.stringify(error.keyValue)}' already exists`,
      );
    }
    throw new InternalServerErrorException(
      `Can't excecute the action, check server logs`,
    );
  }
}
