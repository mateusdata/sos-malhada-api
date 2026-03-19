import { Injectable } from '@nestjs/common';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WaterLevelService } from 'src/water-level/water-level.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly waterLevelService: WaterLevelService
  ) { }

  async create(createNotificationDto: CreateNotificationDto) {
    const level = createNotificationDto.level;
    const levelInMeters = level / 100;
    const getWaterLevel: any = await this.waterLevelService.findAll();
    console.log(levelInMeters);

    const centimeters = 0.20;
    const hasCondition = Math.abs(getWaterLevel?.level - levelInMeters) <= centimeters;
    if (hasCondition) {
      return { message: "A diferença do nível da água é menor ou igual a 20 cm. Nenhum alerta será enviado." };
    }

    if (levelInMeters < 0.2) {
      return { message: "O nível da água não pode ser inferior a 1 metro." };
    }

    await this.waterLevelService.create({ level: levelInMeters, location: "Malhada Bahia" });

    const users = await this.prisma.user.findMany();
    let body: string | null;
    let title: string | null;

    if (levelInMeters <= 3) {
      body = `✅ O nível do rio está em ${levelInMeters.toFixed(2)} metros acima do normal. A situação está sob controle, mas continue acompanhando as atualizações.`;
      title = "Nível do Rio Estável";
    } else if (levelInMeters > 3 && levelInMeters <= 4) {
      body = `⚠️ Alerta Amarelo: O nível do rio subiu para ${levelInMeters.toFixed(2)} metros acima do normal. Acompanhe as atualizações.`;
      title = "Alerta Amarelo";
    } else if (levelInMeters > 4 && levelInMeters <= 7) {
      body = `🟠 Alerta Laranja: O nível do rio está em ${levelInMeters.toFixed(2)} metros. Fique atento às condições do tempo.`;
      title = "Alerta Laranja";
    } else {
      body = `🚨 Alerta Vermelho: O nível do rio atingiu ${levelInMeters.toFixed(2)} metros! Tome precauções imediatamente e busque um local seguro.`;
      title = "Alerta Vermelho";
    }

    const notifications = users.map(async (user) => {
      const data = {
        to: user.deviceToken,
        sound: "default",
        title: title,
        body: body,
        priority: "high", 
        data: {
          level: levelInMeters.toFixed(2),
          nav: "(tabs)/home",
        },
      };

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      return response;
    });

    return await Promise.all(notifications);
  }
}
