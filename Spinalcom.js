function sum(array) {
    let result = 0;
    array.forEach(element => {
        result += element;
    });
    return result;
}
// console.log(sum([20, 30, 40]))


// EXERCICE 1
/*
Écrivez une fonction qui renvoie la factorielle d’un nombre passé en paramètre. 
*/
function fac(n) {
    if (n > 1)
        return fac(n - 1) * n
    return 1
}
//console.log(fac(6))

// EXERCICE 2
/*
Écrivez une fonction qui prend en paramètre une liste de nombres et une fonction callback, 
et retourne une liste filtrée contenant les valeurs de la liste 
qui renvoient true lorsqu’elles sont passées en paramètre à la fonction callback. 
*/

function liste(list) {
    let l = []
    for (i = 0; i < list.length; i++) {
        if (callback(list[i]))
            l.push(i)
    }
    return l
}

// EXERCICE 3
/*
Écrivez une fonction prenant en paramètre deux (2) entiers positifs et 
retournant une liste de nombres de Fibonacci compris entre les deux entiers.
*/



function fib(n) {
    if (n == 0)
        return 0
    if (n == 1)
        return 1
    return fib(n - 1) + fib(n - 2)
}

function fb(n1, n2) {
    list = []
    n = n1
    for (i = 0 + 1; n < n2; i++) {
        n = fib(i)
        if (n > n1 && n < n2) {
            list.push(n)
        }
    }
    return list
}
console.log(fb(10, 100))

// EXERCICE 4
/*
Créez une fonction prenant en paramètre un entier n et une matrice carré de n lignes et n colonnes et 
qui retourne true si la matrice fourni est un carré magique et false sinon.
 */

function magiccarre(n, matrix) {
    value = 0;
    tmp = 0
    tmp2 = 0

    for (i = 0; i < n; i++) {
        value += matrix[0][i]
    }
    // lignes colones
    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            tmp += matrix[i][j]
            tmp2 += matrix[j][i]
        }
        if (tmp != value || tmp2 != value)
            return false;
        tmp = 0
        tmp2 = 0
    }

    // diagonales
    for (i = 0; i < n; i++) {
        tmp += matrix[i][i]
        tmp2 += matrix[i][n - i - 1]
    }
    if (tmp != value || tmp2 != value)
        return false;

    return true
}

a = [
    [6, 1, 8],
    [7, 5, 3],
    [2, 9, 4]
]

console.log(magiccarre(3, a))