import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProduct, getReviewsByCode } from "../api/api";
import { getReviewMean } from "../helpers/ReviewHelper";
import { getCurrentCartAmount } from "../helpers/ShoppingCartHelper";
import { Product, Review, CartItem } from "../shared/shareddtypes";

import ProductCommentList from "./ProductCommentList";
import ProductSpeedDial from "./ProductSpeedDial";
import ReviewDialog from "./ReviewDialog";
import ShareDialog from "./ShareDialog";
import StockAlert from "./StockAlert";

import {
  Paper,
  Typography,
  Grid,
  Button,
  styled,
  Rating,
  Breadcrumbs,
  Link,
} from "@mui/material";

export type ProductProps = {
  product: Product;
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
};

type ProductDets = {
  id: string;
};

const Img = styled("img")({
  margin: "auto",
  display: "block",
  width: "auto",
  height: "50vh",
  objectFit: "cover",
});

function ShopBreadcrumbs(props: any) {
  return (
    <React.Fragment>
      <Breadcrumbs aria-label="breadcrumb" style={{ margin: "2vh 2vw" }}>
        <Link underline="hover" color="inherit" href="/">
          DeDe
        </Link>
        <Link underline="hover" color="inherit" href="/shop/">
          Shop
        </Link>
        <Typography color="text.primary">{props.product}</Typography>
      </Breadcrumbs>
    </React.Fragment>
  );
}

export default function ProductDetails(props: ProductProps): JSX.Element {
  const [product, setProduct] = useState<Product>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dialogOpen, setDialogOpen] = useState(0);
  const [shareDialogOpen, setShareDialogOpen] = useState(0);
  const [starsSelected, setSelectedStars] = useState(0);
  const [currentCartAmount, setCurrentCartAmount] = useState(0);

  const { id } = useParams<keyof ProductDets>() as ProductDets;

  const obtainProduct = async () => {
    if (props.product == null) setProduct(await getProduct(id));
    else setProduct(props.product);
  };

  const obtainReviews = async (code: string) => {
    setReviews(await getReviewsByCode(code));
  };

  const openDialog = () => {
    setDialogOpen(dialogOpen + 1);
  };

  const openShareDialog = () => {
    setShareDialogOpen(shareDialogOpen + 1);
  };

  useEffect(() => {
    obtainProduct();
    obtainReviews(id + "");

    // In case we have obtained a product
    if (product !== undefined)
      setCurrentCartAmount(getCurrentCartAmount(product, props.cartItems));
  }, []);

  const addProductToCart = () => {
    if (product !== undefined) {
      props.onAdd(product);
    }
  };

  if (typeof product === "undefined") {
    return <ShopBreadcrumbs product={id} />;
  } else {
    return (
      <React.Fragment>
        <ShopBreadcrumbs product={product.name} />
        <Grid>
          <Paper
            variant="outlined"
            elevation={8}
            style={{ margin: "3vh 5vw", padding: "1em" }}
          >
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "30vh", margin: "2vh", marginBottom: "4vh" }}
            >
              <Img
                alt="Image of the product"
                src={require("../images/".concat(product.code).concat(".png"))}
              />

              <Grid direction={"column"}>
                <Typography component="h1" variant="h5">
                  {product.name}
                </Typography>

                <Button variant="text" onClick={openDialog} sx={{ my: 1 }}>
                  <Rating
                    name="hover-feedback"
                    value={getReviewMean(reviews)}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      if (newValue != null) {
                        setSelectedStars(newValue);
                      }
                    }}
                  />
                </Button>
                <Paper style={{ margin: "4vh 2vw", padding: ".5em" }}>
                  <Typography>{product.description}</Typography>
                </Paper>
                <Typography component="h2" variant="h6">
                  {product.price}€
                </Typography>
                <Grid style={{ margin: "4vh 0 0 0" }}>
                  <StockAlert
                    stock={product.stock}
                    amount={currentCartAmount}
                  />
                  <Button
                    variant="contained"
                    disabled={product.stock <= currentCartAmount}
                    onClick={addProductToCart}
                    sx={{ my: 1 }}
                  >
                    Add product to cart
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          <ProductCommentList reviews={reviews}></ProductCommentList>
          <ReviewDialog
            product={product}
            show={dialogOpen}
            stars={starsSelected}
          />
          <ShareDialog show={shareDialogOpen} />
        </Grid>

        <ProductSpeedDial
          addToCart={addProductToCart}
          review={openDialog}
          share={openShareDialog}
        />
      </React.Fragment>
    );
  }
}
