import { Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto/auth.dto"; 

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signup(@Body() dto: AuthDTO) {
      return this.authService.signup(dto);
    }
  
    @HttpCode(HttpStatus.OK)   
    @Post('signin')
    signin(@Body() dto: AuthDTO) {
      return this.authService.signin(dto);
    }
}