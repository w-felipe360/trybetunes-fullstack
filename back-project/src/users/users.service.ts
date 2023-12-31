import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, Equal, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    console.log(createUserDto.username);
    user.username = createUserDto.username;
    user.description = null;
    user.image = '../assets/profile.png';

    // Use bcrypt.hashSync with a number representing the number of salt rounds
    const saltRounds = 10;
    user.password = bcrypt.hashSync(createUserDto.password, saltRounds);
    console.log('senha crypto', user.password);
    console.log('senha do usuário:', user.password);
    this.usersRepository.save({
      username: createUserDto.username,
      password: user.password,
      description: null,
      image: '../assets/profile.png',
    });
    console.log(user);
    console.log('a senha do user foi alterada??', user.password);
    return { message: 'user added successfully' };
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }
  async findByUsername(username: string) {
    const oi = await this.usersRepository.findOne({
      where: { username: Equal(username) },
    });
    return oi;
  }

  async login(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    // console.log('user do service ->', user);
    return user;
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    user.username = updateUserDto.username;
    user.description = updateUserDto.description;
    user.image = updateUserDto.image;
    await this.entityManager.save(user);
  }

  async remove(id: number) {
    await this.usersRepository.delete({ id });
    return { message: 'user deleted successfully' };
  }
}
