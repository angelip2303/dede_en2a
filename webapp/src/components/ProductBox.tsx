import { useState } from "react";

import Grid from "@mui/material/Grid";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

function ProductBox(props: any): JSX.Element {
  const [amount, setAmount] = useState<number>(Number());

  function StockAlert(props: any): JSX.Element {
    if (props.stock - amount <= 0) {
      // to prevent from some issues regarding no stock
      return <Chip label="No stock available!" color="error" />;
    } else if (props.stock - amount <= 10) {
      return <Chip label="Few units left!" color="warning" />;
    } else {
      return <Chip label="Stock available!" color="success" />;
    }
  }

  const Img = styled("img")({
    margin: "auto",
    display: "block",
    width: "100%",
    height: "30vh",
  });

  return (
    <Grid container alignItems="center" direction="column" rowSpacing="5">
      <Grid item>
        <ButtonBase>
          <Img
            alt="Image of the product"
            src={require("../images/"
              .concat(props.product.code)
              .concat(".jpg"))}
          />
        </ButtonBase>
      </Grid>
      <Grid item xs>
        <Typography gutterBottom variant="subtitle1" component="div">
          {props.product.name}
        </Typography>
      </Grid>
      <Grid item xs>
        <Typography gutterBottom variant="subtitle1" component="div">
          {props.product.price}€
        </Typography>
      </Grid>
      <Grid item xs>
        <StockAlert stock={props.product.stock} />
      </Grid>
      <Grid item xs>
        <Button
          variant="contained"
          disabled={props.product.stock - amount <= 0}
          onClick={() => {
            setAmount(amount + 1);
            props.onAdd(props.product);
          }}
        >
          Add product
        </Button>
      </Grid>
    </Grid>
  );
}

export default ProductBox;
