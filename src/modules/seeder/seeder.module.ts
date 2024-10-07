import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Streak, StreakSchema } from './store/streak.entity';
import { User, UserSchema } from './store/user.entity';
import { Auth, AuthSchema } from './store/auth.entity';
import { Notification, NotificationSchema } from './store/notification.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Streak.name, schema: StreakSchema },
      { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
