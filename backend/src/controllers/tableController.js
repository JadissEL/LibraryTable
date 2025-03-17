import TableService from '../services/tableService.js';

class TableController {
  static async createTable(req, res) {
    try {
      const table = await TableService.createTable(req.body);
      res.status(201).json({
        success: true,
        data: table
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAllTables(req, res) {
    try {
      const tables = await TableService.getAllTables();
      res.status(200).json({
        success: true,
        data: tables
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving tables'
      });
    }
  }

  static async getAvailableTables(req, res) {
    try {
      const criteria = {};
      if (req.query.capacity) {
        const capacity = parseInt(req.query.capacity);
        if (isNaN(capacity) || capacity <= 0) {
          return res.status(400).json({ success: false, message: 'Invalid capacity' });
        }
        criteria.capacity = { $gte: capacity };
      }
      if (req.query.location) {
        criteria.location = req.query.location;
      }

      const tables = await TableService.getAvailableTables(criteria);
      res.status(200).json({
        success: true,
        data: tables
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving available tables'
      });
    }
  }

  static async getTableById(req, res) {
    try {
      const table = await TableService.getTableById(req.params.id);
      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Table not found'
        });
      }
      res.status(200).json({
        success: true,
        data: table
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateTable(req, res) {
    try {
      const table = await TableService.updateTable(req.params.id, req.body);
      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Table not found'
        });
      }
      res.status(200).json({
        success: true,
        data: table
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async searchTables(req, res) {
    try {
      const filters = {
        capacity: req.query.capacity ? parseInt(req.query.capacity) : undefined,
        location: req.query.location,
        features: req.query.features ? req.query.features.split(',') : undefined,
        isAvailable: req.query.isAvailable === 'true'
      };

      const tables = await TableService.searchTables(filters);
      res.status(200).json({
        success: true,
        data: tables
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching tables'
      });
    }
  }

  static async deleteTable(req, res) {
    try {
      const table = await TableService.deleteTable(req.params.id);
      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Table not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Table deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default TableController;
