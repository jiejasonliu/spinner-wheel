import { Wheel } from '@/models/wheel';
import { HistoryModel } from '@/models/history';
const API_URL: string = import.meta.env.VITE_API_URL;

export function getHistoriesClient() {
  return {
    getHistoriesByWheelId,
  };

  async function getHistoriesByWheelId(wheelId: Wheel['_id']): Promise<HistoryModel[]> {
    try {
      const response = await fetch(`${API_URL}/histories/${wheelId}`, { method: "GET" });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error(error);
    }
    throw new Error(`An unexpected error occurred while fetching histories for wheel id of ${wheelId}`);
  }
}