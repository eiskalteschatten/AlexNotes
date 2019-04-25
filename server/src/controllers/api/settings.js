// 'use strict';

// const Settings = require('../../models/Settings');


// module.exports = router => {
//     router.get('/', async (req, res) => {
//         const userId = req.user.id;

//         try {
//             const settings = await Settings.findOne({ where: { userId }});
//             res.json({
//                 theme: settings.theme
//             });
//         }
//         catch(error) {
//             console.error(new Error(error));
//             res.status(500).send('');
//         }
//     });

//     router.put('/', async (req, res) => {
//         const userId = req.user.id;
//         const body = req.body;
//         const values = {
//             theme: body.theme
//         };

//         try {
//             let settings = await Settings.findOne({ where: { userId }});

//             if (settings) {
//                 await Settings.update(values, { where: { userId }});
//             }
//             else {
//                 settings = await Settings.create(values);
//                 await settings.setUser(req.user);
//             }

//             res.status(201).send('');
//         }
//         catch(error) {
//             console.error(new Error(error));
//             res.status(500).send('');
//         }
//     });
// };
