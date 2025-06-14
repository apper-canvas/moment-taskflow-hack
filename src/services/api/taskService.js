import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    this.tableName = 'task';
    this.fields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'title', 'completed', 'priority', 'category_id', 'due_date', 'created_at', 'completed_at', 'notes'
    ];
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        Fields: this.fields,
        orderBy: [
          { FieldName: "created_at", SortType: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields
      };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async create(taskData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const taskRecord = {
        title: taskData.title,
        completed: false,
        priority: taskData.priority || 'medium',
        category_id: taskData.categoryId ? parseInt(taskData.categoryId) : null,
        due_date: taskData.dueDate,
        created_at: new Date().toISOString(),
        completed_at: null,
        notes: taskData.notes || null
      };
      
      const params = {
        records: [taskRecord]
      };
      
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const updateRecord = {
        Id: parseInt(id),
        ...updates
      };
      
      // Handle completed_at field
      if (updates.completed !== undefined) {
        updateRecord.completed_at = updates.completed ? new Date().toISOString() : null;
      }
      
      // Handle category_id conversion
      if (updates.categoryId !== undefined) {
        updateRecord.category_id = updates.categoryId ? parseInt(updates.categoryId) : null;
        delete updateRecord.categoryId;
      }
      
      const params = {
        records: [updateRecord]
      };
      
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  async bulkDelete(ids) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        RecordIds: ids.map(id => parseInt(id))
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions;
      }
      
      return [];
    } catch (error) {
      console.error("Error bulk deleting tasks:", error);
      return [];
    }
  }

  async toggleComplete(id) {
    try {
      // Get current task data first
      const currentTask = await this.getById(id);
      if (!currentTask) {
        throw new Error('Task not found');
      }
      
      // Update with toggled completion status
      const updates = {
        completed: !currentTask.completed
      };
      
      return await this.update(id, updates);
    } catch (error) {
      console.error("Error toggling task completion:", error);
      throw error;
    }
  }

  async getByCategory(categoryId) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        Fields: this.fields,
        where: [
          {
            FieldName: "category_id",
            Operator: "ExactMatch",
            Values: [categoryId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      return [];
    }
  }

  async getByPriority(priority) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        Fields: this.fields,
        where: [
          {
            FieldName: "priority",
            Operator: "ExactMatch",
            Values: [priority]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by priority:", error);
      return [];
    }
  }

  async search(query) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        Fields: this.fields,
        whereGroups: [
          {
            operator: "OR",
            SubGroups: [
              {
                conditions: [
                  {
                    FieldName: "title",
                    Operator: "Contains",
                    Values: [query]
                  }
                ],
                operator: ""
              },
              {
                conditions: [
                  {
                    FieldName: "notes",
                    Operator: "Contains",
                    Values: [query]
                  }
                ],
                operator: ""
              }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching tasks:", error);
      return [];
    }
  }
}

export default new TaskService();