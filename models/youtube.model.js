import mongoose from 'mongoose';

const youtubeSchema = new mongoose.Schema(
  {
    nombreCanal: {
      type: String,
      required: [true, 'El nombre del canal es obligatorio'],
      trim: true
    },
    creadorPrincipal: {
      type: String,
      required: [true, 'El creador principal es obligatorio'],
      trim: true
    },
    categoria: {
      type: String,
      required: [true, 'La categoria del canal es obligatoria'],
      trim: true,
      enum: [
        'Educacion',
        'Tecnologia',
        'Entretenimiento',
        'Musica',
        'Gaming',
        'Deportes',
        'Noticias',
        'Estilo de vida'
      ]
    },
    pais: {
      type: String,
      required: [true, 'El pais es obligatorio'],
      trim: true
    },
    idiomaPrincipal: {
      type: String,
      required: [true, 'El idioma principal es obligatorio'],
      trim: true
    },
    suscriptores: {
      type: Number,
      required: [true, 'La cantidad de suscriptores es obligatoria'],
      min: [0, 'Los suscriptores no pueden ser negativos']
    },
    videosPublicados: {
      type: Number,
      required: [true, 'La cantidad de videos publicados es obligatoria'],
      min: [0, 'Los videos publicados no pueden ser negativos']
    },
    visualizacionesMensuales: {
      type: Number,
      required: [true, 'Las visualizaciones mensuales son obligatorias'],
      min: [0, 'Las visualizaciones mensuales no pueden ser negativas']
    },
    promedioDuracionVideo: {
      type: Number,
      required: [true, 'El promedio de duracion del video es obligatorio'],
      min: [1, 'La duracion promedio debe ser mayor a 0']
    },
    estadoMonetizacion: {
      type: String,
      required: [true, 'El estado de monetizacion es obligatorio'],
      enum: ['Activa', 'Pendiente', 'Suspendida', 'No monetizado'],
      default: 'No monetizado'
    },
    verificado: {
      type: Boolean,
      default: false
    },
    enlaceCanal: {
      type: String,
      required: [true, 'El enlace del canal es obligatorio'],
      trim: true
    },
    descripcion: {
      type: String,
      required: [true, 'La descripcion es obligatoria'],
      trim: true,
      minlength: [10, 'La descripcion debe tener al menos 10 caracteres']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Youtube = mongoose.model('Youtube', youtubeSchema);

export default Youtube;
