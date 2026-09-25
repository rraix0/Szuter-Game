use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use surrealdb::engine::remote::ws::Client;
use surrealdb::Surreal;
use surrealdb::types::RecordId;
use uuid::Uuid;
use crate::types::ws_room::WsRoom;
use crate::types::ws_player::WSPlayer;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Game {
    pub players: HashMap<Uuid, WSPlayer>,
    pub rooms: HashMap<Uuid, WsRoom>
}

impl Game {
    pub fn new() -> Game {
        Game {
            players: HashMap::new(),
            rooms: HashMap::new(),
        }
    }
    pub fn add_player(&mut self, uuid: Uuid, player: WSPlayer) {
        self.players.insert(uuid, player);
    }
    pub fn remove_player(&mut self, uuid: Uuid) {
        self.players.remove(&uuid);
    }
    pub fn get_player(&self, uuid: &Uuid) -> Option<&WSPlayer> {
        self.players.get(uuid)
    }
    pub fn get_player_mut(&mut self, uuid: &Uuid) -> Option<&mut WSPlayer> {
        self.players.get_mut(uuid)
    }
    pub fn get_player_authorized(&mut self, uuid: &Uuid, jwt: &Uuid) -> Result<&mut WSPlayer, String> {
        let player: &mut WSPlayer = self.players.get_mut(uuid).ok_or("User not found")?;
        if player.jwt == *jwt {
            Ok(player)
        } else {
            Err("Wront Token")?
        }
    }
    pub fn get_players_in_room(&self, room: &Uuid) -> Vec<&WSPlayer> {
        let all_players: Vec<&WSPlayer> = self.players.values().collect();
        let players_in_room: Vec<&WSPlayer> = all_players.iter().filter(|player| player.room == Some(*room)).map(|player| *player).collect();
        players_in_room
    }

    pub async fn join_game(&mut self, db: Surreal<Client>, player_uuid: Uuid) -> Result<Uuid, String> {
        let rooms = self.get_rooms();

        let room_uuid: Uuid = {
            if rooms.len() == 0 {
                self.create_random_room(db).await?
            } else {
                let available_rooms:Option<(&Uuid, usize)> = self.rooms
                    .keys()
                    .filter_map(|room_id| {
                        let count = self.players
                            .values()
                            .filter(|player| player.room == Some(*room_id))
                            .count();
                        if count < 10 {
                            Some((room_id, count))
                        } else {
                            None
                        }
                    })
                    .max_by_key(|(_, count)| *count);

                if let Some((room_id, _)) = available_rooms {
                    *room_id
                } else {
                    self.create_random_room(db).await?
                }
            }
        };

        let player = self.get_player_mut(&player_uuid).ok_or("Player not found")?;

        player.room = Some(room_uuid);
        Ok(room_uuid)
    }

    pub async fn create_random_room(&mut self, db: Surreal<Client>) -> Result<Uuid, String> {
        let mut result = db
            .query("SELECT id FROM maps ORDER BY rand() LIMIT 1;")
            .await
            .map_err(|err| {
                println!("querying maps failed, err: {:?}", err);
                "Internal server error".to_string()
            })?;

        let record_id = result
            .take::<Option<RecordId>>(0)
            .map_err(|_| "Nie udało się odczytać wyniku".to_string())?
            .ok_or_else(|| "Nie znaleziono mapy".to_string())?;

        let uuid = Uuid::new_v4();
        let room = WsRoom {
            map: record_id,
        };
        self.create_room(uuid, room);

        Ok(uuid)
    }

    pub fn create_room(&mut self, uuid: Uuid, room: WsRoom) {
        self.rooms.insert(uuid, room);
    }
    pub fn remove_room(&mut self, uuid: Uuid) {
        self.rooms.remove(&uuid);
    }
    pub fn get_room(&self, uuid: &Uuid) -> Option<&WsRoom> {
        self.rooms.get(uuid)
    }
    pub fn get_room_mut(&mut self, uuid: &Uuid) -> Option<&mut WsRoom> {
        self.rooms.get_mut(uuid)
    }
    pub fn get_rooms(&self) -> Vec<&WsRoom> {
        self.rooms.values().collect()
    }
}