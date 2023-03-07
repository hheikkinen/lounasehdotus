import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { api } from "../../config";
import { DateTime } from "luxon";
import { AxiosResponse } from "axios";

type Restaurant = {
  id: number;
  name: string;
  city: string;
  address: string;
  dishes: Dish[];
};

type Dish = {
  id: number;
  name: string;
  price: number;
  restaurantId: number;
};

const MainView = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const getLunchList = async () => {
    setRestaurants([]);
    setLoading(true);
    api
      .get("/lunches?city=kuopio&date=" + DateTime.now().toFormat("yyyy-LL-dd"))
      .then((res: AxiosResponse<Array<Restaurant>>) => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getLunchList();
  }, []);

  return (
    <React.Fragment>
      <Grid container>
        {loading && (
          <Grid item xs={12}>
            Ladataan...
          </Grid>
        )}

        {restaurants &&
          restaurants.map((restaurant) => (
            <Grid item xs={12} key={restaurant.id}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">{restaurant.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {restaurant.dishes.map((dish: any) => (
                    <Typography variant="body1" key={dish.id}>
                      {dish.name}
                    </Typography>
                  ))}
                </AccordionDetails>
                <AccordionActions>
                  <Typography variant="body2">{restaurant.address}</Typography>
                </AccordionActions>
              </Accordion>
            </Grid>
          ))}
      </Grid>
    </React.Fragment>
  );
};

export default MainView;
