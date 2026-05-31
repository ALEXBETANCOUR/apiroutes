import Youtube from '../models/youtube.model.js';

export const getYoutubeRecords = async (req, res) => {
  try {
    const records = await Youtube.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los registros', error: error.message });
  }
};

export const getYoutubeRecordById = async (req, res) => {
  try {
    const record = await Youtube.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el registro', error: error.message });
  }
};

export const createYoutubeRecord = async (req, res) => {
  try {
    const newRecord = await Youtube.create(req.body);
    res.status(201).json({
      message: 'Registro de canal de YouTube creado correctamente',
      data: newRecord
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el registro', error: error.message });
  }
};

export const updateYoutubeRecord = async (req, res) => {
  try {
    const updatedRecord = await Youtube.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedRecord) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    res.status(200).json({
      message: 'Registro de canal de YouTube actualizado correctamente',
      data: updatedRecord
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el registro', error: error.message });
  }
};

export const deleteYoutubeRecord = async (req, res) => {
  try {
    const deletedRecord = await Youtube.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    res.status(200).json({
      message: 'Registro de canal de YouTube eliminado correctamente',
      data: deletedRecord
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el registro', error: error.message });
  }
};
