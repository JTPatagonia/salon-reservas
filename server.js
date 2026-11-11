const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Servir la página web estática desde la misma carpeta
app.use(express.static(path.join(__dirname)));

// Configurar el transportador de correo con tu cuenta de Gmail y contraseña de aplicación
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'opensalonreservas@gmail.com',
        pass: process.env.EMAIL_PASS || 'wwdc tmsl vcyy xzmt'
    }
});

// Ruta para recibir la reserva desde la web y enviar el correo
app.post('/api/enviar-reserva', async (req, res) => {
    const { client_name, client_email, client_phone, service_name, booking_day, booking_time } = req.body;

    const mailOptions = {
        from: '"Salón de Belleza" <opensalonreservas@gmail.com>',
        to: client_email,
        cc: 'opensalonreservas@gmail.com', // Copia también para el salón de tu mamá
        subject: '¡Confirmación de tu Cita - Salón de Belleza!',
        html: `
            <h2>¡Hola ${client_name}!</h2>
            <p>Tu cita ha sido agendada con éxito.</p>
            <ul>
                <li><strong>Servicio:</strong> ${service_name}</li>
                <li><strong>Día:</strong> ${booking_day}</li>
                <li><strong>Hora:</strong> ${booking_time}</li>
                <li><strong>Teléfono de contacto:</strong> ${client_phone}</li>
            </ul>
            <p>¡Te esperamos!</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ success: false, message: 'Error al enviar el correo' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});