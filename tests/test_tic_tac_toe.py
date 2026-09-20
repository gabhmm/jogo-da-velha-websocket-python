import pytest

try:
    from jogo_da_velha_websocket_python.server.game.tic_tac_toe import TicTacToeGame
except ImportError:
    from src.jogo_da_velha_websocket_python.server.game.tic_tac_toe import TicTacToeGame



def test_initial_state():
    game = TicTacToeGame()
    assert game.status == "WAITING_OPPONENT"
    assert game.winner is None
    assert game.current_turn == "X"
    assert all(cell is None for cell in game.board)

def test_make_move_valid():
    game = TicTacToeGame()
    game.start_game()
    game.make_move(0, "X")
    assert game.board[0] == "X"
    assert game.current_turn == "O"

def test_make_move_invalid_turn():
    game = TicTacToeGame()
    game.start_game()
    with pytest.raises(ValueError, match="Não é o seu turno!"):
        game.make_move(0, "O")

def test_make_move_occupied_cell():
    game = TicTacToeGame()
    game.start_game()
    game.make_move(0, "X")
    with pytest.raises(ValueError, match="Esta casa já está preenchida."):
        game.make_move(0, "O")

def test_make_move_invalid_index():
    game = TicTacToeGame()
    game.start_game()
    with pytest.raises(ValueError, match="Posição inválida no tabuleiro."):
        game.make_move(9, "X")
    with pytest.raises(ValueError, match="Posição inválida no tabuleiro."):
        game.make_move(-1, "X")

def test_game_not_in_progress():
    game = TicTacToeGame()
    with pytest.raises(ValueError, match="O jogo não está em andamento."):
        game.make_move(0, "X")

def test_x_wins_row():
    game = TicTacToeGame()
    game.start_game()
    game.make_move(0, "X")
    game.make_move(3, "O")
    game.make_move(1, "X")
    game.make_move(4, "O")
    game.make_move(2, "X")
    
    assert game.status == "FINISHED"
    assert game.winner == "X"

def test_o_wins_diagonal():
    game = TicTacToeGame()
    game.start_game()
    game.make_move(1, "X")
    game.make_move(0, "O")
    game.make_move(2, "X")
    game.make_move(4, "O")
    game.make_move(3, "X")
    game.make_move(8, "O")
    
    assert game.status == "FINISHED"
    assert game.winner == "O"

def test_draw():
    game = TicTacToeGame()
    game.start_game()
    # X O X
    # O O X
    # X X O
    moves = [
        (0, "X"), (1, "O"), (2, "X"),
        (4, "O"), (5, "X"), (3, "O"),
        (6, "X"), (8, "O"), (7, "X")
    ]
    for idx, player in moves:
        game.make_move(idx, player)
        
    assert game.status == "FINISHED"
    assert game.winner == "EMPATE"
