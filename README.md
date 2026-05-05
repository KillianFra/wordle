# Wordle

Ce projet se base sur [l'atomic design](https://atomicdesign.bradfrost.com/chapter-2/) pour la définition et la gestion de ses différents composants.

## Elements fondamentaux Wordle

Wordle est un jeu de lettres qui propose de faire deviner un mot (**5 Lettres**) en **6 Essais**, a chaque essai, chaques lettres recoit un status :

🟢 La Lettre est a la bonne position.

🟨 La Lettre est présente dans le mot, mais ne se trouve pas a la bonne place.

🟥 La Lettre n'est pas présente dans le mot.

#### Conditions de la parties:

- [ ] Si Le joueur n'as pas trouvé le mot en 6 essais, la partie s'arrete et le joueur a perdu.

- [ ] Si le joueur trouve le mot en moins de 6 essais, la partie s'arrete et le joueur a gagné (affichage de son nombre d'essai)

- [ ] *V2* - Si le joueur rentre un mot qui n'existe pas dans la langue francaise, le mot est refusé et aucun essais n'est compté


#### Modélisation des comportements

- Le joueur soumet un mot : qu'est-ce qui est retourné ?

Lorsque le joueur soumet un mot, le jeu va d'abord s'assurer que le mot fait exactement 5 lettres, puis le jeu va comparer les lettres rentré avec le mot a deviner.
Puis afficher les differents status de chaque lettres.

- Le joueur trouve le bon mot : que devient la partie ?
Le joueur trouve le bon mot, la partie se termine, le joueur ne peut plus rentrer d'input.
- Le joueur épuise ses 6 tentatives : que se passe-t-il ?
La partie se termine, le mot a trouver s'affiche en dessous dans une nouvelle ligne, le jeu affiche perdu.
- Le joueur soumet un mot qui n'existe pas dans le dictionnaire ?

Lorsque le joueur soumet un mot, Le site doit comparer l'input du joueur avec la liste (locale) de mots, si le mot n'est pas present dans cette liste, le mot est refusé et l'input est clear.
- Le joueur essaie de jouer alors que la partie est déjà terminée ?

Les inputs sont désactivés lorsque la partie est terminé. le jpoueur ne peut donc plus jouer


