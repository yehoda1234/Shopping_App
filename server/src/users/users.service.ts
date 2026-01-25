import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, firstName, lastName, role } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate email error code for PostgreSQL
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role'],
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }
  
  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('No data to update');
    }
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updatedUser);
  }
  
  remove(id: number) { return `Remove logic`; };


async findOrCreateOAuthUser(email: string, provider: string, profile: any) {
   
    let user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      if (provider === 'google' && !user.googleId) {
        user.googleId = profile.id;
        user.provider = 'google';
        await this.userRepository.save(user);
      }
      return user;
    }

    // 2. יצירת משתמש חדש
    user = this.userRepository.create({
      email: email,                  // זה חייב להיות מחרוזת!
      firstName: profile.firstName,  // מגיע מהפרופיל
      lastName: profile.lastName,    // מגיע מהפרופיל
      picture: profile.picture,
      provider: provider,
      googleId: profile.id,
      password: null,
    });

    return this.userRepository.save(user);
  }
}




  
