import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminRepository } from './../admin/admin.repository';
import { HashHelper } from 'src/helpers/hash.helper';
import { LoginDTO } from './dto/login.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as Caches from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminRepository: AdminRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Caches.Cache,
  ) {}

  public async login({ email, password }: LoginDTO): Promise<any> {
    try {
      const user = await this.adminRepository.getByEmail(email);

      if (!user) {
        throw new UnauthorizedException();
      }

      const passwordMatch = await HashHelper.compare(password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException();
      }

      const payload = { username: user.email, sub: user.adminId };
      const accessToken = this.jwtService.sign(payload);

      await this.cacheManager.set(
        `blacklist_${accessToken}`,
        `${accessToken}`,
        {
          ttl: 3600,
        },
      );

      return {
        user: user,
        access_token: accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  public async checkTokenActive(key: string): Promise<boolean> {
    return (await this.cacheManager.get(key)) || false;
  }

  public async logout(token: string): Promise<any> {
    try {
      await this.cacheManager.del(`blacklist_${token}`);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
