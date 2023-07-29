import {
  CreateWheel,
  Wheel,
  UpdateWheelWinner,
  UpdateWheel,
} from "@/models/wheel";

const API_URL: string = import.meta.env.VITE_API_URL;

export function getWheelsClient() {
  return {
    getWheels,
    getWheelById,
    createWheel,
    deleteWheelById,
    updateWheelById,
    updateWheelWinner,
  };

  async function getWheels(): Promise<Wheel[]> {
    try {
      const response = await fetch(`${API_URL}/wheels`, { method: "GET" });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error(error);
    }
    throw new Error("An unexpected error occurred while fetching wheels");
  }

  async function getWheelById(id: string): Promise<Wheel> {
    try {
      const response = await fetch(`${API_URL}/wheels/${id}`, {
        method: "GET",
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error(error);
    }
    throw new Error(`An unexpected error occurred while getting wheel ${id}`);
  }

  async function createWheel(createWheelInfo: CreateWheel): Promise<Wheel> {
    try {
      const response = await fetch(`${API_URL}/wheels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createWheelInfo),
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error(error);
    }
    throw new Error("An unexpected error occurred while creating new wheel");
  }

  async function deleteWheelById(id: string): Promise<Wheel> {
    try {
      const response = await fetch(`${API_URL}/wheels/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error(error);
    }
    throw new Error(`An unexpected error occurred while deleting wheel ${id}`);
  }

  async function updateWheelById(
    id: string,
    updateWheelInfo: UpdateWheel
  ): Promise<Wheel> {
    try {
      const response = await fetch(`${API_URL}/wheels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateWheelInfo),
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error(error);
    }
    throw new Error(`An unexpected error occurred while updating wheel ${id}`);
  }

  async function updateWheelWinner(
    id: string,
    updateWheelWinnerInfo: UpdateWheelWinner
  ): Promise<Wheel> {
    try {
      const response = await fetch(`${API_URL}/wheels/${id}/winner`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateWheelWinnerInfo),
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error(error);
    }
    throw new Error(`An unexpected error occurred while updating wheel ${id}`);
  }
}
