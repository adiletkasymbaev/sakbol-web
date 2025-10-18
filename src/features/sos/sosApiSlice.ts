import { apiSlice } from "../../api/apiSlice";

export const sosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🚨 Создать SOS-сигнал
    createSosSignal: builder.mutation<
      { id: number; sender: any; latitude: number; longitude: number; created_at: string; is_active: boolean },
      { latitude: number; longitude: number }
    >({
      query: (body) => ({
        url: "/sos/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SosSignal"],
    }),

    // 📡 Получить список активных SOS-сигналов
    getActiveSosSignals: builder.query<
      Array<{ id: number; sender: any; latitude: number; longitude: number; created_at: string; is_active: boolean }>,
      void
    >({
      query: () => "/sos/?is_active=true",
      providesTags: ["SosSignal"],
    }),
  }),
});

export const {
  useCreateSosSignalMutation,
  useGetActiveSosSignalsQuery,
} = sosApiSlice;