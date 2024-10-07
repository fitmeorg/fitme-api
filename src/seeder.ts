import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { Streak, StreakSchema } from '@modules/seeder/store/streak.entity';
import { SeederService } from '@modules/seeder/seeder.service';
import { Auth, AuthSchema } from '@modules/seeder/store/auth.entity';
import { User, UserSchema } from '@modules/seeder/store/user.entity';
import {
  Notification,
  NotificationSchema,
} from '@modules/seeder/store/notification.entity';

seeder({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/fitme'),
    MongooseModule.forFeature([
      { name: Streak.name, schema: StreakSchema },
      { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
}).run([SeederService]);
