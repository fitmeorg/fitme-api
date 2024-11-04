import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Streak } from './store/streak.entity';
import { Model } from 'mongoose';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { User } from './store/user.entity';
import { Auth } from './store/auth.entity';
import { faker } from '@faker-js/faker';
import { Notification } from './store/notification.entity';

const MAXIMUM_NUMBER_SEEDERS = 141543;

@Injectable()
export class SeederService implements Seeder {
  constructor(
    @InjectModel(Streak.name)
    private readonly streakModel: Model<Streak>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Auth.name)
    private readonly authModel: Model<Auth>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async seed() {
    const streaks = DataFactory.createForClass(Streak).generate(
      MAXIMUM_NUMBER_SEEDERS,
    );
    const auth = DataFactory.createForClass(Auth).generate(
      MAXIMUM_NUMBER_SEEDERS,
    );

    for (let index = 0; index < MAXIMUM_NUMBER_SEEDERS; index++) {
      const firstName = faker.person.firstName();

      const authDocument = await this.authModel.create({
        mail: `${Math.random().toString(36).substring(2, 7)}${faker.internet.email({ firstName })}`,
        username: `${faker.internet.userName({ firstName })}${Math.random().toString(36).substring(2, 7)}`,
        password: faker.internet.password({ length: 10 }),
        ...auth[index],
      });

      const userDocument = await this.userModel.create({
        name: faker.person.fullName({ firstName }),
        auth: authDocument._id,
      });

      await this.notificationModel.create({
        user: userDocument._id,
        name: userDocument.name,
        username: authDocument.username,
        mail: authDocument.mail,
      });

      await this.streakModel.create({
        user: userDocument._id,
        ...streaks[index],
      });
    }
  }

  async drop() {
    await this.streakModel.deleteMany();
    await this.userModel.deleteMany();
    await this.authModel.deleteMany();
    await this.notificationModel.deleteMany();
  }
}
