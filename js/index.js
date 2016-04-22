/* 
1. Create a 3 x 3 grid of squares
2. Player goes first as X
3. Turns alternate between player and computer
4. A win is when there are 3 X's or 3 O's in a row
5. If no win, play until all squares are full
6. Computer unbeatable
*/

$(document).ready(function() {
  
  var board;
  var turn;
  var running;
  var compMove;

  // Set turn, board, and running
  function newGame() {
   
    $(".tile").text("").removeClass("fa fa-times fa-circle-o");
    $(".tile").text("").removeClass("fa fa-times");    
    running = true;
    board = ["", "", "", "", "", "", "", "", ""];
    playerTurn(board, "Human");
  }
  
  function startPopup() {
    
    $(".pop-up-start").css("display", "inline-block");
    $(".pop-up-start").addClass("animated bounceInDown");
  
    $(".cross, .naught").on("click", function() {
      $(this).toggleClass("clicked");
      $(".pop-up-start").addClass("animated bounceOutUp")

      turn = $(this).text();
      newGame();
    });
  }
  
  startPopup();
  
  function endPopup() {
    
    
    $(".pop-up-end").css("display", "inline-block");
    $(".pop-up-end").addClass("animated bounceInDown");
    
    $(".new-game").on("click", function() {
      $(this).toggleClass("clicked");
      $(".pop-up-end").addClass("animated bounceOutUp");
      newGame();
    });
 
  }               

  function playerTurn(state, player) {

    $(".tile").on("click", function() {
      // If no win or tie conditions are met
      if (running) {
        var num = Number($(this).attr("id"));
        // If blank, set icon and assign X value
        if (state[num] == "") {
          $(this).html("<i class='fa fa-times'></i>");
          state[num] = "X";      
          // Check for win and comp turn
          compTurn(state, "Comp") 
        }
      }
    })
  }
  
  function winTest(state) {
    // Check for all X's or O's for rows
    for (var i = 0; i <= 6; i = i + 3) {
      if (state[i] !== "" && state[i] === state[i + 1] && state[i + 1] === state[i + 2]) {
        if (state[i] === "X") {
          return "X";
        } else {
          return "O";
        }
      }
    }
    // Check for all Xs or O's for columns
    for (var i = 0; i <= 2; i++) {
      if (state[i] !== "" && state[i] === state[i + 3] && state[i + 3] === state[i + 6]) {
        if (state[i] === "X") {
          return "X";
        } else {
          return "O";
        }
      }
    }
    // For diagonals
    for (var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
      if (state[i] !== "" && state[i] === state[i + j] && state[i + j] === state[i + 2 * j]) {
        if (state[i] === "X") {
          return "X";
        } else {
          return "O";
        }
      }
    }
    // Check if all squares are full
    var full = true;  
    for (var i = 0; i < state.length; i++) {
      if (state[i] == "") {
        full = false;
      }
    }
    if (full) {
      return "Tie"
    }
  }

  function compTurn(state, player) {
    if (running) {
      // Run the minimax algorithm to find best move
      miniMax(state, player);
      // Set the icon and assign the best move to O
      state[compMove] = "O";
      $("#" + compMove.toString()).html("<i class='fa fa-circle-o'></i>");
      playerTurn(state, "Human")
      
      if (winTest(state) === "X" || winTest(state) === "O") {
        $(".result").text(winTest(state) + " wins");
        endPopup();
      } else if (winTest(state) === "Tie") {
        $(".result").text("Tie game")
        endPopup();
      }
    }
  }

  // Calculate open squares by checking for empty squares then filter to array
  function freeMoves(state) {
    return state.map(function(element, index) {
      if (element === "") {
        return index;
      }
    }).filter(function(element) {
      return state[element] === "";
    });
  }
  // About minimax - https://en.wikipedia.org/wiki/Minimax
  function miniMax(state, player) {
    // Assign point values for end result so comp can max or min
    if (winTest(state) === "O") {
      return 10;
    } 
    if (winTest(state) === "X") {
      return -10;
    } 
    if (winTest(state) === "Tie") {
      return 0;
    }
    var scores = [];
    var moves = [];
    // Cycle through open moves, assign X or O to open squares, push results to scores, and keep going until all possibilities tested
    freeMoves(state).forEach(function(square) {
      state[square] = (player === "Comp") ? "O" : "X";
      scores.push(miniMax(state, (player === "Comp") ? "Human" : "Comp"));
      moves.push(square);
      state[square] = "";
    });
    if (player === "Comp") {
      // Comp takes move with max value as best move
      compMove = moves[scores.indexOf(Math.max.apply(Math, scores))];
      return Math.max.apply(Math, scores);
    } else {
      // Else if player, comp tries to minimize
      compMove = moves[scores.indexOf(Math.min.apply(Math, scores))];
      return Math.min.apply(Math, scores);
    }
  }
});