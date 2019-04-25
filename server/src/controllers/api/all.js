'use strict';


module.exports = router => {
    router.get('/', async (req, res) => {
        // const userName = req.user.userName;

        try {

            res.json({
                notebooks: [],
                folders: [],
                notes: []
            });
        }
        catch(error) {
            console.error(new Error(error));
            res.status(500).send('');
        }
    });
};
