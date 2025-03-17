import Table from '../models/Table.js';

class TableService {
  static async createTable(tableData) {
    const table = new Table(tableData);
    return await table.save();
  }

  static async getAllTables() {
    return await Table.find({});
  }

  static async getAvailableTables(criteria = {}) {
    const query = { isAvailable: true, ...criteria };
    return await Table.find(query);
  }

  static async getTableById(id) {
    return await Table.findById(id);
  }

  static async updateTable(id, updateData) {
    return await Table.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  static async searchTables(filters) {
    const query = {};

    if (filters.capacity) {
      query.capacity = { $gte: filters.capacity };
    }

    if (filters.location) {
      query.location = filters.location;
    }

    if (filters.features && filters.features.length > 0) {
      query.features = { $all: filters.features };
    }

    if (filters.isAvailable !== undefined) {
      query.isAvailable = filters.isAvailable;
    }

    return await Table.find(query);
  }

  static async deleteTable(id) {
    return await Table.findByIdAndDelete(id);
  }
}

export default TableService;
