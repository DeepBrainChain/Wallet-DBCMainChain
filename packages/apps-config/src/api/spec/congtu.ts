import type { OverrideBundleDefinition } from "@polkadot/types/types";

const definitions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [0, undefined],
      types: {
        URL: "Text",
        MachineId: "Text",
        TelecomName: "Text",
        StandardGpuPointPrice: {
          gpu_point: "u64",
          gpu_price: "Balance",
        },
        LiveMachine: {
          bonding_machine: "Vec<MachineId>",
          online_machine: "Vec<MachineId>",
          rented_machine: "Vec<MachineId>",
          offline_machine: "Vec<MachineId>",
        },
        ControllerMachine: {
          total_machine: "Vec<MachineId>",
          online_machine: "Vec<MachineId>",
          total_calc_points: "u64",
          total_gpu_num: "u64",
          total_rented_gpu: "u64",
          total_rent_fee: "Balance",
        },
        SysInfoDetail: {
          total_gpu_num: "u64",
          total_rented_gpu: "u64",
          total_staker: "u64",
          total_calc_points: "u64",
          total_rent_fee: "Balance",
        },
        MachineInfo: {
          controller: "AccountId",
          machine_stash: "AccountId",
          last_machine_renter: "Option<AccountId>",
          bonding_height: "BlockNumber",
          online_height: "BlockNumber",
          last_online_height: "BlockNumber",
          machine_status: "MachineStatus",
          total_rented_duration: "u64",
          total_rented_times: "u64",
          total_rent_fee: "Balance",
          machine_info_detail: "MachineInfoDetail",
        },
        MachineStatus: {
          _enum: {
            CommitteeVerifying: null,
            Online: null,
            StakerReportOffline: "(BlockNumber, Box<MachineStatus>)",
            ReporterReportOffline: "(Box<MachineStatus>, AccountId, Vec<AccountId>)",
            Creating: null,
            Rented: null,
          },
        },
        MachineInfoDetail: {
          machine_hardware_info: "MachineHardware",
          server_room_info: "ServerRoom",
        },
        MachineHardware: {
          machine_id: "MachineId",
          gpu_type: "Vec<u8>",
          gpu_num: "u32",
          cuda_core: "u32",
          gpu_mem: "u64",
          cpu_type: "Vec<u8>",
          cpu_core_num: "u32",
          cpu_rate: "u64",
          mem_num: "u64",
          sys_disk: "u64",
          data_disk: "u64",
          calc_point: "u64",
        },
        ServerRoom: {
          server_room: "H256",
          upload_net: "u64",
          download_net: "u64",
          longitude: "Longitude",
          latitude: "Latitude",
          telecom_operators: "Vec<TelecomName>",
        },
        Longitude: {
          _enum: {
            East: "u64",
            West: "u64",
          },
        },
        Latitude: {
          _enum: {
            North: "u64",
            South: "u64",
          },
        },
        PosInfo: {
          online_gpu: "u64",
          offline_gpu: "u64",
          rented_gpu: "u64",
          online_gpu_calc_points: "u64",
        },
        RentOrderDetail: {
          renter: "AccountId",
          rent_start: "BlockNumber",
          confirm_rent: "BlockNumber",
          rent_end: "BlockNumber",
          stake_amount: "Balance",
          rent_status: "RentStatus",
        },
        RentStatus: {
          _enum: ["WaitingVerifying", "Renting", "RentExpired"],
        },
      },
    },
  ],
};

export default definitions;
