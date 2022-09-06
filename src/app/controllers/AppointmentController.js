import { format, isBefore, parseISO, startOfHour, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import * as yup from 'yup';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';
import Appointments from '../models/Appointments';
import File from '../models/File';
import User from '../models/User';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointments.findAll({
      where: { user_id: req.userId, canceled_at: null },
      attributes: ['id', 'date'],
      order: ['date'],
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      provider_id: yup.number().required(),
      date: yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (!checkIsProvider) {
      return res.status(401).json({
        error: 'you can only create appointments with providers:',
        checkIsProvider,
      });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past are not permited' });
    }

    const checkAvailability = await Appointments.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date,
      },
    });
    if (checkAvailability) {
      return res.status(400).json({ error: 'Appointment date not available' });
    }
    const appointment = await Appointments.create({
      user_id: req.userId,
      provider_id,
      date,
    });
    const user = await User.findByPk(req.userId);
    const formatedDate = format(hourStart, "'dia'dd 'de'MMMM', às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o dia de Junho às 8:60h`,
      user: provider_id,
    });
    return res.status(201).json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointments.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          atttributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }

    appointment.canceled_at = new Date();

    await Queue.add(CancellationMail.key()),
      {
        appointment,
      };

    await appointment.save();

    return res.status(200).json();
  }
}

export default new AppointmentController();
