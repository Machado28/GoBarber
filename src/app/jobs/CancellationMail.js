import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'cancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.provider.user,
        date: format(
          appointment.date,
          "'dia 'dd 'de 'MMMM,'de' yyyy ',às' H'hrs':mm'min'",
          { locale: pt },
        ),
      },
    });
  }
}
export default new CancellationMail();
