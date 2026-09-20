from typing import List, Optional

class TicTacToeGame:
    def __init__(self):
        self.board: List[Optional[str]] = [None] * 9
        self.current_turn: str = "X"
        self.status: str = "WAITING_OPPONENT"
        self.winner: Optional[str] = None

    def start_game(self, starting_player: str = "X"):
        """Inicia (ou reinicia) uma partida."""
        self.board = [None] * 9
        self.current_turn = starting_player
        self.status = "IN_PROGRESS"
        self.winner = None

    def make_move(self, index: int, player_symbol: str) -> bool:
        """Tenta fazer a jogada. Levanta ValueError se inválido, ou retorna True se com sucesso."""
        if self.status != "IN_PROGRESS":
            raise ValueError("O jogo não está em andamento.")
        if player_symbol != self.current_turn:
            raise ValueError("Não é o seu turno!")
        if index < 0 or index > 8:
            raise ValueError("Posição inválida no tabuleiro.")
        if self.board[index] is not None:
            raise ValueError("Esta casa já está preenchida.")

        self.board[index] = player_symbol
        self._check_winner()

        if self.status == "IN_PROGRESS":
            # Alterna a vez de jogar
            self.current_turn = "O" if self.current_turn == "X" else "X"
            
        return True

    def _check_winner(self):
        """Varre o tabuleiro buscando vitórias ou empate."""
        winning_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], # linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], # colunas
            [0, 4, 8], [2, 4, 6]             # diagonais
        ]
        
        for combo in winning_combinations:
            a, b, c = combo
            if self.board[a] and self.board[a] == self.board[b] and self.board[a] == self.board[c]:
                self.winner = self.board[a]
                self.status = "FINISHED"
                return

        # Checa se não sobrou nenhuma casa vazia
        if all(cell is not None for cell in self.board):
            self.winner = "EMPATE"
            self.status = "FINISHED"
