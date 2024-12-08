// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { UsersRepository } from 'src/modules/users/users.repository';
// import { TokenAuthEntity } from '../entities/token-auth.entity';
// import { JwtPayload } from '../interfaces/jwt-payload.interface';
// import { TokenInterface } from '../interfaces/token.interface';
// import { TokenAuthRepository } from '../token-auth.repository';

// @Injectable()
// export class TokenService {
//   constructor(
//     @InjectRepository(UsersRepository)
//     private usersRepository: UsersRepository,
//     private jwtService: JwtService,
//     private configService: ConfigService,
//     private tokenAuthRepository: TokenAuthRepository,
//   ) {}

//   public async generateAuthToken(payload: JwtPayload): Promise<TokenInterface> {
//     // const accessTokenExpires = this.configService.get('ACCESS_TOKEN_EXPIRES_IN');
//     // const refreshTokenExpires = this.configService.get('REFRESH_TOKEN_EXPIRES_IN');
//     const tokenType = this.configService.get('TOKEN_TYPE');
//     const accessToken = await this.generateToken(payload);

//     const tokenAuthEntity = new TokenAuthEntity();
//     tokenAuthEntity.token = accessToken;
//     tokenAuthEntity.user = await this.usersRepository.getByUserId(
//       payload.userId,
//     );

//     await this.tokenAuthRepository.upsert(tokenAuthEntity, {
//       conflictPaths: ['user.userId'],
//     });

//     return {
//       tokenType,
//       accessToken: payload.access_token,
//       // accessTokenExpires,
//       refreshToken: payload.refresh_token,
//       token: accessToken,
//       userType: payload.userType,
//       idToken: payload.id_token,
//     };
//   }

//   public async deleteAuthToken(userId: string, token: string): Promise<any> {
//     return this.tokenAuthRepository.delete({
//       user: { userId: userId },
//       token: token,
//     });
//   }

//   // public async generateRefreshToken(refreshToken: string): Promise<TokenInterface> {
//   //   const { userId, email } = this.verifyToken(refreshToken, TokenType.RefreshToken);
//   //   return this.generateAuthToken({ userId, email });
//   // }

//   // public verifyToken(token: string, type: TokenType) {
//   //   try {
//   //     return this.jwtService.verify(token);
//   //   } catch ({ name }) {
//   //     throw new UnauthorizedException();
//   //   }
//   // }

//   // public async validateToken(token: string): Promise<{ valid: boolean }> {
//   //   try {
//   //     const { userId } = this.jwtService.verify(token);
//   //     const user = await this.usersRepository.findOne(userId);
//   //     if (!user || user.status == UserStatus.Blocked || user.status == UserStatus.Inactive) {
//   //       return { valid: false };
//   //     }

//   //     return { valid: !!userId };
//   //   } catch (error) {
//   //     Logger.error('Validation token error', error);
//   //     return { valid: false };
//   //   }
//   // }

//   async generateToken(payload: JwtPayload): Promise<string> {
//     const token = this.jwtService.sign(payload);
//     return token;
//   }
// }
