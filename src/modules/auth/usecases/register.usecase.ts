import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { TokenService } from '../services/token.service';
import { AuditService } from '../../../modules/shared/services/audit.service';

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly auditService: AuditService,
  ) {}

  async execute(input: RegisterInput) {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.usersService.createUser({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
    });

    const tokens = await this.tokenService.generateTokenPair(user);
    await this.auditService.log({
      userId: user.id,
      action: 'REGISTER',
      entityType: 'User',
      entityId: user.id,
    });

    return { user: user.toPublic(), ...tokens };
  }
}
